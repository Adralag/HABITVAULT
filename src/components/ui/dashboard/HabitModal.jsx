import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import HabitForm from './HabitForm';

const HabitModal = ({ 
  isOpen, 
  closeModal, 
  habit = null, 
  onSubmit,
  title = null,
  isLoading = false
}) => {
  const modalTitle = title || (habit ? 'Edit Habit' : 'Create New Habit');

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  {modalTitle}
                </Dialog.Title>
                
                <HabitForm 
                  habit={habit} 
                  onSubmit={(formData) => {
                    onSubmit(formData);
                  }}
                  onCancel={closeModal}
                  isLoading={isLoading}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default HabitModal;