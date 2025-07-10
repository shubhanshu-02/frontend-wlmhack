import React from 'react';
import ItemCard from './ItemCard';
import { Item } from '../types';

interface ItemGridProps {
  items: Item[];
  onReserveItem: (item: Item) => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({ items, onReserveItem }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Items ({items.length})
        </h2>
        <div className="flex items-center space-x-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Sort by: Newest</option>
            <option>Sort by: Price: Low to High</option>
            <option>Sort by: Price: High to Low</option>
            <option>Sort by: Condition</option>
            <option>Sort by: Eco Score</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No items found</div>
          <p className="text-gray-500">Try adjusting your filters or check back later for new items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onReserve={onReserveItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemGrid;