import { z } from 'zod';

export const rfqSchema = z
  .object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z.string().optional(),
    category: z.enum(['Product', 'Service', 'Equipment', 'Software', 'Maintenance', 'Other'], {
      required_error: 'Category is required',
    }),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
      required_error: 'Priority is required',
    }),
    startDate: z.any().optional(),
    deadline: z.string().min(1, 'Submission Deadline is required'),
    items: z
      .array(
        z.object({
          name: z.string().min(1, 'Item Name is required'),
          description: z.string().optional(),
          quantity: z
            .number({ invalid_type_error: 'Quantity must be a valid number' })
            .min(1, 'Quantity must be at least 1'),
          unit: z.string().min(1, 'Unit is required'),
          budget: z
            .number({ invalid_type_error: 'Budget must be a valid number' })
            .min(0, 'Budget must be positive')
            .optional(),
        })
      )
      .min(1, 'At least 1 line item is required'),
    assignedVendorIds: z.array(z.string()).min(1, 'At least 1 vendor must be assigned to the RFQ'),
  })
  .refine(
    (data) => {
      const start = data.startDate ? new Date(data.startDate) : new Date();
      const end = new Date(data.deadline);
      // Remove time components for pure date comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return end >= start;
    },
    {
      message: 'Submission Deadline must be a future date and after or on the start date',
      path: ['deadline'],
    }
  );
