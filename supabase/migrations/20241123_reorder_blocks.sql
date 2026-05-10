
create type block_order_update as (
  id uuid,
  order_position integer
);

create or replace function bulk_update_block_order(updates block_order_update[])
returns void as $$
begin
  foreach update_item in array updates
  loop
    update public.blocks
    set order_position = update_item.order_position
    where id = update_item.id;
  end loop;
end;
$$ language plpgsql;
