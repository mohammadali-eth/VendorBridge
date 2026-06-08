import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export default function QuotationItemTable() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items') || [];

  // Recalculate totals and subtotal dynamically
  useEffect(() => {
    let newSubtotal = 0;
    let maxDelivery = 0;
    items.forEach((item, index) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const total = qty * price;
      newSubtotal += total;

      const itemDelivery = Number(item.deliveryDays) || 0;
      if (itemDelivery > maxDelivery) {
        maxDelivery = itemDelivery;
      }

      // Update individual item total field in the form state silently
      if (item.total !== total) {
        setValue(`items.${index}.total`, total);
      }
    });

    setValue('subtotal', newSubtotal);
    if (maxDelivery > 0) {
      setValue('deliveryDays', maxDelivery);
    }
  }, [items, setValue]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quotation Item Table</h4>
        <p className="text-[11px] text-slate-400 font-medium">Please enter your bid unit price for each requested item.</p>
      </div>

      <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50/70">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[45%]">
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[35%]">
                  Item
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[15%] text-center">
                  Quantity
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[18%]">
                  Unit Price (₹) <span className="text-rose-500">*</span>
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[20%] text-right">
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[18%]">
                  Unit Price (₹) <span className="text-rose-500">*</span>
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[18%] text-center">
                  Delivery (days) <span className="text-rose-500">*</span>
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-slate-500 w-[14%] text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field, index) => {
                const itemErrors = errors.items?.[index];
                const qty = Number(items[index]?.quantity) || 0;
                const price = Number(items[index]?.unitPrice) || 0;
                const total = qty * price;

                return (
                  <tr key={field.id} className="hover:bg-slate-50/20">
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-bold text-slate-800 block">{field.name}</span>
                        {field.description && (
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5 truncate max-w-sm">
                            {field.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">
                      {qty} <span className="text-[10px] text-slate-400 font-medium ml-0.5">{field.unit}</span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="relative max-w-[150px]">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                          className={`w-full bg-slate-50 border ${
                            itemErrors?.unitPrice ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-250 focus:ring-[#714B67]'
                          } rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {itemErrors?.unitPrice && (
                        <p className="text-rose-600 text-[10px] mt-1 font-medium">{itemErrors.unitPrice.message}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="relative max-w-[120px] mx-auto">
                        <input
                          type="number"
                          placeholder="7"
                          {...register(`items.${index}.deliveryDays`, { valueAsNumber: true })}
                          className={`w-full bg-slate-50 border ${
                            itemErrors?.deliveryDays ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-250 focus:ring-[#714B67]'
                          } rounded-xl py-1.5 px-3 text-xs text-center focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {itemErrors?.deliveryDays && (
                        <p className="text-rose-600 text-[10px] mt-1 font-medium text-center">{itemErrors.deliveryDays.message}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right font-black text-slate-800">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
