'use client';

import React, { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { useBulkUpdateWebsiteFaqOrderMutation } from '@/store/features/admin/websiteFaqApiService';

const FAQ_CATEGORY_LABELS = {
  client: 'Client',
  lawyer: 'Lawyer',
  general: 'General',
};

const WEBSITE_TYPE_LABELS = {
  tla_main: 'TLA Main',
  company: 'Company',
};

function SortableFaqItem({ faq }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: faq._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 mb-2 flex items-center gap-4 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <button
        className="cursor-grab text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <div className="font-medium text-gray-900">{faq.question}</div>
        <div className="text-sm text-gray-500 mt-1 line-clamp-1">{faq.answer}</div>
      </div>

      <Badge variant="outline" className="shrink-0 capitalize">
        {WEBSITE_TYPE_LABELS[faq.websiteType] || faq.websiteType}
      </Badge>

      <Badge variant={faq.isActive ? 'default' : 'secondary'} className="shrink-0">
        {faq.isActive ? 'Active' : 'Inactive'}
      </Badge>

      <div className="text-xs text-gray-400 w-20 text-right">
        Order: {faq.order}
      </div>
    </div>
  );
}

export default function DraggableFaqList({ faqs, onReorderSuccess }) {
  const [groupedFaqs, setGroupedFaqs] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [bulkUpdateOrder] = useBulkUpdateWebsiteFaqOrderMutation();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Group FAQs by category
  React.useEffect(() => {
    const grouped = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});

    // Sort each group by order
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.order - b.order);
    });

    setGroupedFaqs(grouped);
  }, [faqs]);

  const handleDragEnd = async (event, category) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const categoryFaqs = groupedFaqs[category];
    const oldIndex = categoryFaqs.findIndex((item) => item._id === active.id);
    const newIndex = categoryFaqs.findIndex((item) => item._id === over.id);

    // Reorder within the category
    const reorderedFaqs = arrayMove(categoryFaqs, oldIndex, newIndex);

    // Update order values based on new positions
    const updatedFaqs = reorderedFaqs.map((faq, index) => ({
      ...faq,
      order: index,
    }));

    // Update grouped state
    setGroupedFaqs((prev) => ({
      ...prev,
      [category]: updatedFaqs,
    }));
  };

  const handleSaveOrder = async (category) => {
    setIsSaving(true);
    try {
      const categoryFaqs = groupedFaqs[category];
      const updates = categoryFaqs.map((faq) => ({
        id: faq._id,
        order: faq.order,
      }));

      const res = await bulkUpdateOrder(updates).unwrap();
      if (res?.success) {
        showSuccessToast('Order saved successfully');
        if (onReorderSuccess) {
          onReorderSuccess();
        }
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <div key={category} className="border rounded-lg p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                {FAQ_CATEGORY_LABELS[category] || category}
              </h3>
              <span className="text-sm text-gray-500">
                ({categoryFaqs.length} FAQs)
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => handleSaveOrder(category)}
              disabled={isSaving}
              variant="outline"
            >
              {isSaving ? 'Saving...' : 'Save Order'}
            </Button>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, category)}
            sensors={sensors}
          >
            <SortableContext
              items={categoryFaqs.map((f) => f._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {categoryFaqs.map((faq) => (
                  <SortableFaqItem
                    key={faq._id}
                    faq={faq}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </div>
  );
}
