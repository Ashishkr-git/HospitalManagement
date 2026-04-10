import React from "react";
import { AlertCircle, X } from "lucide-react";

export default function ErrorAlert({ isOpen, onClose, title = "Error", message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 duration-200 z-999 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm overflow-hidden duration-200 bg-white shadow-2xl rounded-2xl animate-in zoom-in-95">
        
        {/* Close Icon (Optional top right) */}
        <div className="flex justify-end p-2">
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          {/* Error Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-red-600 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900">
            {title}
          </h3>

          {/* Message */}
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {message || "Something went wrong. Please try again."}
          </p>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 text-sm font-medium text-white transition-all bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}