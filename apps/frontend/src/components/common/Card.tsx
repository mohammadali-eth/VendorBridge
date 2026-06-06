import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  loading?: boolean;
  gradientTop?: boolean;
  gradientColor?: string; // e.g. 'from-[#714B67] to-[#A87D9F]'
  hoverLift?: boolean;
  hFull?: boolean;
}

export default function Card({
  title,
  subtitle,
  extra,
  children,
  className,
  bodyClassName,
  loading = false,
  gradientTop = false,
  gradientColor = 'from-[#714B67] to-[#A87D9F]',
  hoverLift = false,
  hFull = false,
}: CardProps) {
  const cardContent = (
    <div
      className={clsx(
        'relative bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col',
        hFull && 'h-full',
        className
      )}
    >
      {/* Top Gradient Border */}
      {gradientTop && (
        <div className={clsx('h-1 w-full bg-gradient-to-r', gradientColor)} />
      )}

      {/* Card Header */}
      {(title || subtitle || extra) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-[#111827] leading-6">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 leading-4">{subtitle}</p>
            )}
          </div>
          {extra && <div className="flex-shrink-0">{extra}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={clsx('flex-1 flex flex-col', bodyClassName || 'p-6')}>
        {loading ? (
          <div className="animate-pulse flex-1 space-y-4 py-1 p-6">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );

  if (hoverLift && !loading) {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        className={clsx(hFull && 'h-full')}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
