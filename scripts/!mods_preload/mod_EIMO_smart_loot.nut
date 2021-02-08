::mods_registerMod("SmartLootEIMO", 2.1, "Smart Loot integrated into EIMO");
::mods_queue(null, "EndsInventoryManagementOverhaul, >mod_smartLoot", function()
{
  ::mods_hookNewObject("ui/screens/tactical/tactical_combat_result_screen", function(o)
  {
    local CostPerTool = 250.0 / 20; // assume 250 coins per bundle of 20 tools
    local Assets = Const.World.Assets, ItemType = Const.Items.ItemType;

    local function isFood(i) { return i.isItemType(ItemType.Food); }

    local function isWorthRepairing(sellValue, durability) { return durability > 0 && sellValue * 0.15 / durability * 20 * 15 / 250 * 120 >= ::EIMOwaitUntilRepairedThreshold;}

    local function baseSellValue(i)
    {
      local fullValue = i.m.Value; // we would like to use i.getValue() but it's inconsistent as to whether certain modifiers are applied
      if("Assets" in World) // this is false in the tutorial, for example
      {
        fullValue *= World.Assets.getSellPriceMult() * Const.Difficulty.SellPriceMult[World.Assets.getEconomicDifficulty()];
      }
      if(i.isItemType(ItemType.Food | ItemType.TradeGood)) return fullValue; // trade goods sell for full value and don't deteriorate
      if(i.isItemType(ItemType.Loot)) return fullValue * Assets.BaseLootSellPrice; // loot sells for nearly full value and doesn't deteriorate
      if(i.isItemType(ItemType.Supply)) return fullValue * 1.5; // food and supplies are not sold, so use the replacement cost (w/ 50% markup)
      return fullValue * Assets.BaseSellPrice;
    }

    local function sellValue(i)
    {
      if(isFood(i)) // use a fixed valuation formula for food based on its desirability and
      {             // the amount we can expect to eat (assuming 10 per day until it spoils)
        return Math.min(i.getAmount(), i.getSpoilInDays()*10) * (i.isDesirable() ? 6 : 4);
      }
      else
      {
        local value = baseSellValue(i), condition = i.getCondition(), maxCondition = i.getConditionMax();
        if(condition < maxCondition)
        {
          if(isWorthRepairing(value, maxCondition))
          {
            local toolsRequired = (maxCondition - condition) / 15.0;
            value -= toolsRequired * CostPerTool;
          }
          else
          {
            value = value * condition / maxCondition;
          }
        }
        return value;
      }
    }

    local show = o.show;
    o.show = function()
    {
      if(!isVisible())
      {
        local function foodValue(i) { return i.getAmount() * i.getSpoilInDays(); }
        Tactical.CombatResultLoot.getItems().sort(function(a, b) // order loot value (but put some types at the beginning)
        {
          local ac = isFood(a), bc = isFood(b); // put food first
          if(ac) return bc ? foodValue(b) <=> foodValue(a) : -1;
          else if(bc) return 1;

          ac = a.isItemType(ItemType.Supply), bc = b.isItemType(ItemType.Supply); // put supply items second
          if(ac && !bc) return -1;
          else if(bc && !ac) return 1;

          ac = a.isItemType(ItemType.Crafting), bc = b.isItemType(ItemType.Crafting); // put crafting items third
          if(ac && !bc) return -1;
          else if(bc && !ac) return 1;

          return sellValue(b) <=> sellValue(a); // and in general order by sell value, descending
        });
      }
      show();
    }

    o.onSmartLootButtonPressed <- function()
    {
      if(Tactical.CombatResultLoot.isEmpty()) return Const.UI.convertErrorToUIData(Const.UI.Error.FoundLootListIsEmpty);

      local si = 0, stash = Stash.getItems(), loot = Tactical.CombatResultLoot.getItems(), shrinkLoot = false, soundPlayed = false;

      // we want to order the loot so we take the most valuable items first. but we don't actually want to shuffle the
      // items in the display, so sort an array of indexes instead
      local li, lootis = array(loot.len());
      for(local i = 0; i < lootis.len(); ++i) lootis[i] = i;
      lootis.sort(@(ai,bi) sellValue(loot[bi]) <=> sellValue(loot[ai]));

      local function onItemDropped(i) { i.onRemovedFromStash(Stash.getID()); }
      local function onItemTaken(i)
      {
        i.onAddedToStash(Stash.getID());
        if(isWorthRepairing(baseSellValue(i), i.getConditionMax())) i.setToBeRepaired(true);
        if(!soundPlayed)
        {
          i.playInventorySound(this.Const.Items.InventoryEventType.PlacedInBag);
          soundPlayed = true;
        }
      }

      // first, automatically add any supplies to our supply totals
      for(li = 0; li < lootis.len(); ++li)
      {
        local item = loot[lootis[li]];
        if(item.isItemType(ItemType.Supply))
        {
          item.consume();
          loot[lootis[li]] = null;
          shrinkLoot = true;
        }
      }

      // then, take as many items as we can fit in our stash
      for(li = 0; li < lootis.len(); ++li)
      {
        local item = loot[lootis[li]];
        if(item == null) continue; // we already took it, move to the next
        // find an empty stash slot, if any
        while(si < stash.len() && stash[si] != null) ++si;
        if(si == stash.len()) break; // if there were no free stash slots, we're done
        stash[si++] = item; // otherwise, take the item
        loot[lootis[li]] = null;
        onItemTaken(item);
        shrinkLoot = true;
      }

      if(li < lootis.len()) // if we couldn't take all the items...
      {
        // food is treated specially. although not valuable in coin, we can't afford to run out, so value it as the number of days it'll
        // feed us and always save some. one complication is that food is eaten by bros in a certain order, with desirable food eaten before
        // undesirable food, etc. so the value of a food pile depends on what other food piles exist. (e.g. undesirable food has zero value
        // if it will spoil before bros finish eating the desirable food.)
        local foodItems = [], foodPerDay = "Assets" in World ? World.Assets.getDailyFoodCost() * World.Assets.m.FoodConsumptionMult : 30;
        foreach(i in stash)
        {
          if(isFood(i)) foodItems.append(i);
        }

        local foodOrder = "Assets" in World ? World.Assets.sortFoodByFreshness : function(a, b)
        {
          local ac = a.isDesirable(), bc = b.isDesirable();
          if(ac && !bc) return -1;
          else if(bc && !ac) return 1;
          else return a.getBestBeforeTime() <=> b.getBestBeforeTime();
        };
        foodItems.sort(foodOrder);

        local function removeFoodItem(i) { foodItems.remove(foodItems.find(i)); }
        local function addFoodItem(i)
        {
          local left = 0, right = foodItems.len()-1; // binary search to keep the array ordered
          while(left <= right)
          {
            local mid = (left+right) / 2, cmp = foodOrder(foodItems[mid], i);
            if(cmp < 0) left = mid + 1;
            else if(cmp > 0) right = mid - 1;
            else { left = mid; break; } 
          }
          foodItems.insert(left, i);
        }

        local function countFoodDays(withoutItem = null, withItem = null)
        {
          local days = 0, remaining = foodPerDay;
          local function consume(i)
          {
            for(local amount = i.getAmount(); amount > 0 && i.getSpoilInDays() > days; )
            {
              remaining -= amount;
              if(remaining >= 0) break; // if we consumed the remainder of the food item, we're done with it
              amount = -remaining; // otherwise, we ate all the food we need for today, so put the rest back
              ++days; // and advance to the next day
              remaining = foodPerDay;
            }
          }
          foreach(item in foodItems)
          {
            if(item == withoutItem) continue;
            if(withItem != null && foodOrder(item, withItem) >= 0) { consume(withItem); withItem = null; }
            consume(item);
          }
          if(withItem != null) consume(withItem);
          return days + (foodPerDay-remaining) / foodPerDay.tofloat(); // give credit for partial days
        }

        // we want to swap the least valuable items from our stash for the most valuable loot. sort the stash to put the
        // least valuable items first. again, we don't want to alter the real order so we'll sort an array of indexes
        local stashis = array(stash.len());
        for(local i = 0; i < stashis.len(); ++i) stashis[i] = i;
        stashis.sort(@(ai,bi) sellValue(stash[ai]) <=> sellValue(stash[bi]));

        // not all items are eligible to be dropped from the player's stash
        local IneligibleTypes = ItemType.Legendary | ItemType.Named | ItemType.Tool |
          ItemType.Crafting | ItemType.Supply | ItemType.Usable;
        local function isEligible(i)
        {
          local type = i.getItemType();
          if((type & IneligibleTypes) || type == ItemType.Misc) return false; // don't drop important or special items
          if((type & ItemType.Accessory) && i.getSlotType() != Const.ItemSlot.Bag) return false; // or important accessories
          if(isFood(i) && countFoodDays(i) < 4) return false; // don't drop food if it'd leave us with less than four days' worth
          if(i.m.isFavorite) return false; //Keep favorite items from EIMO
          return true;
        }

        // swap cheap items for more valuable ones
        for(si = 0; li < lootis.len(); ++li)
        {
          local lootItem = loot[lootis[li]], stashItem;
          if(lootItem == null) continue;
          // find the next stash item eligible for swapping
          while(si < stashis.len() && !isEligible(stashItem = stash[stashis[si]])) ++si;
          // if we couldn't find one, or if it's no longer profitable to swap, then we're done
          if(si == stashis.len() || sellValue(lootItem) <= sellValue(stashItem)) break;
          // otherwise, swap the items
          stash[stashis[si++]] = lootItem;
          loot[lootis[li]] = stashItem;
          if(isFood(stashItem)) removeFoodItem(stashItem);
          if(isFood(lootItem)) addFoodItem(lootItem);
          onItemDropped(stashItem);
          onItemTaken(lootItem);
        }

        // finally, we want to enhance our supply of food. some food is expensive and other food is cheap, but once purchased, the value in
        // coin doesn't really matter. what matters is the nutritional value. unfortunately, due to the way food is consumed, we'd have to
        // consider various combinations of items to maximize food days. (for example, it might be better to remove all desirable food to
        // force bros to eat undesirable food sooner.) and that gets complicated, so we'll just use a simple, fixed valuation function
        if(foodItems.len() != 0)
        {
          local foodValueMult = Math.minf(0.2, foodItems.len() / foodPerDay.tofloat()); // assume we eat at least 5 per day from each pile
          local function foodValue(i) // value each food pile as the number of days it'll feed us (falsely
          {                           // assuming we eat piles evenly), plus a bonus for larger piles
            local amount = i.getAmount()
            return Math.minf(amount*foodValueMult, i.getSpoilInDays()) + amount*0.04; // 0.04 = 1/25
          }
          lootis.sort(function(ai, bi)
          {
            local a = loot[ai], b = loot[bi], ac = a != null && isFood(a), bc = b != null && isFood(b);
            return ac ? bc ? foodValue(b) <=> foodValue(a) : -1 : bc ? 1 : 0; // put food first
          });
          stashis.sort(function(ai, bi)
          {
            local a = stash[ai], b = stash[bi], ac = isFood(a), bc = isFood(b);
            return ac ? bc ? foodValue(a) <=> foodValue(b) : -1 : bc ? 1 : 0; // put food first
          });
          local foodDays = countFoodDays();
          for(li = 0, si = 0; li < lootis.len() && si < stashis.len(); ++li)
          {
            local lootItem = loot[lootis[li]];
            if(lootItem == null) continue;
            local stashItem = stash[stashis[si]];
            if(!isFood(lootItem) || !isFood(stashItem) || foodValue(lootItem) <= foodValue(stashItem)) break;
            local newFoodDays = countFoodDays(stashItem, lootItem);
            if(newFoodDays > foodDays)
            {
              stash[stashis[si++]] = lootItem;
              loot[lootis[li]] = stashItem;
              removeFoodItem(stashItem);
              addFoodItem(lootItem);
              onItemDropped(stashItem);
              onItemTaken(lootItem);
              foodDays = newFoodDays;
            }
          }
        }
      }

      if(shrinkLoot) Tactical.CombatResultLoot.shrink();
			return {
				stash = UIDataHelper.convertStashToUIData(true),
				foundLoot = UIDataHelper.convertCombatResultLootToUIData()
			};
    }
  });
});
