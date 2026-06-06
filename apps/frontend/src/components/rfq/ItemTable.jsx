import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, X, ShieldAlert } from 'lucide-react';

export default function ItemTable() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleAddItem = () => {
    append({
      name: '',
      quantity: 1,
      unit: 'NOS',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Line items</h4>
      </div>

      {errors.items?.root && (
        <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold">
          <ShieldAlert className="h-4 w-4" />
          <span>{errors.items.root.message}</span>
        </div>
      )}

      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
          <thead className="bg-slate-50/70">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-semibold text-slate-500 w-1/2">
                item
              </th>
              <th scope="col" className="px-4 py-2.5 font-semibold text-slate-500 w-[20%]">
                qty
              </th>
              <th scope="col" className="px-4 py-2.5 font-semibold text-slate-500 w-[20%]">
                Unit
              </th>
              <th scope="col" className="px-4 py-2.5 w-[10%] text-center">
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.map((field, index) => {
              const itemErrors = errors.items?.[index];
              return (
                <tr key={field.id} className="hover:bg-slate-50/30">
                  {/* Item name */}
                  <td className="px-4 py-2 align-top">
                    <input
                      type="text"
                      {...register(`items.${index}.name`)}
                      placeholder="e.g. Ergonomic chair"
                      className={`w-full bg-transparent border-0 border-b ${
                        itemErrors?.name ? 'border-rose-300 focus:border-rose-500 focus:ring-0' : 'border-slate-200 focus:border-[#714B67] focus:ring-0'
                      } py-1.5 focus:outline-none text-xs`}
                    />
                    {itemErrors?.name && (
                      <p className="text-rose-600 text-[10px] mt-0.5 font-medium">{itemErrors.name.message}</p>
                    )}
                  </td>

                  {/* Qty */}
                  <td className="px-4 py-2 align-top">
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="1"
                      className={`w-full bg-transparent border-0 border-b ${
                        itemErrors?.quantity ? 'border-rose-300 focus:border-rose-500 focus:ring-0' : 'border-slate-200 focus:border-[#714B67] focus:ring-0'
                      } py-1.5 focus:outline-none text-xs`}
                    />
                    {itemErrors?.quantity && (
                      <p className="text-rose-600 text-[10px] mt-0.5 font-medium">{itemErrors.quantity.message}</p>
                    )}
                  </td>

                  {/* Unit */}
                  <td className="px-4 py-2 align-top">
                    <select
                      {...register(`items.${index}.unit`)}
                      className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-[#714B67] focus:ring-0 py-1.5 focus:outline-none text-xs"
                    >
                      <option value="NOS">NOS</option>
                      <option value="PCS">PCS</option>
                      <option value="BOX">BOX</option>
                      <option value="SET">SET</option>
                      <option value="KG">KG</option>
                    </select>
                  </td>

                  {/* Remove action */}
                  <td className="px-4 py-2 align-middle text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5 text-slate-400" />
        + add line item
      </button>
    </div>
  );
}
