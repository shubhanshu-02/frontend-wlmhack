import React from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Item } from '../types';

interface CartItem extends Item {
  cartQuantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const totalSavings = items.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.cartQuantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <span>Shopping Cart ({items.length})</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.condition}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-bold text-gray-900">${item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item._id, Math.max(0, item.cartQuantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.cartQuantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item._id, Math.min(item.quantity, item.cartQuantity + 1))}
                      disabled={item.cartQuantity >= item.quantity}
                      className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Savings:</span>
                <span>${totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;