import { Item, Partner } from '../types';

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Apple MacBook Pro 16"',
    originalPrice: 2499,
    price: 1899,
    condition: 'like-new',
    category: 'Electronics',
    description: 'Customer return - original packaging, minimal use',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    location: 'Atlanta, GA',
    seller: 'TechHub Solutions',
    ecoScore: 95,
    timePosted: '2 hours ago',
    estimatedSavings: 600,
    carbonFootprintSaved: 45
  },
  {
    id: '2',
    name: 'Samsung 55" 4K Smart TV',
    originalPrice: 799,
    price: 599,
    condition: 'open-box',
    category: 'Electronics',
    description: 'Open box return - all accessories included',
    image: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Dallas, TX',
    seller: 'Electronics Plus',
    ecoScore: 88,
    timePosted: '4 hours ago',
    estimatedSavings: 200,
    carbonFootprintSaved: 32
  },
  {
    id: '3',
    name: 'KitchenAid Stand Mixer',
    originalPrice: 379,
    price: 289,
    condition: 'good',
    category: 'Home & Kitchen',
    description: 'Customer return - minor cosmetic wear, fully functional',
    image: 'https://images.pexels.com/photos/4226719/pexels-photo-4226719.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Phoenix, AZ',
    seller: 'Home Essentials Co.',
    ecoScore: 92,
    timePosted: '1 day ago',
    estimatedSavings: 90,
    carbonFootprintSaved: 18
  },
  {
    id: '4',
    name: 'Nike Air Max Running Shoes',
    originalPrice: 129,
    price: 89,
    condition: 'like-new',
    category: 'Sports & Outdoors',
    description: 'Size exchange return - never worn outside',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Miami, FL',
    seller: 'SportGear Local',
    ecoScore: 90,
    timePosted: '3 hours ago',
    estimatedSavings: 40,
    carbonFootprintSaved: 8
  },
  {
    id: '5',
    name: 'Dyson V15 Cordless Vacuum',
    originalPrice: 549,
    price: 429,
    condition: 'open-box',
    category: 'Home & Kitchen',
    description: 'Open box return - tested and certified',
    image: 'https://images.pexels.com/photos/4239142/pexels-photo-4239142.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Seattle, WA',
    seller: 'Clean Solutions Inc.',
    ecoScore: 94,
    timePosted: '5 hours ago',
    estimatedSavings: 120,
    carbonFootprintSaved: 28
  },
  {
    id: '6',
    name: 'Instant Pot 8-Quart',
    originalPrice: 119,
    price: 89,
    condition: 'good',
    category: 'Home & Kitchen',
    description: 'Customer return - minor box damage, product perfect',
    image: 'https://images.pexels.com/photos/4518464/pexels-photo-4518464.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Chicago, IL',
    seller: 'Kitchen Pro',
    ecoScore: 89,
    timePosted: '6 hours ago',
    estimatedSavings: 30,
    carbonFootprintSaved: 12
  }
];

export const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'TechHub Solutions',
    type: 'business',
    location: 'Atlanta, GA',
    rating: 4.8,
    totalSales: 1247,
    ecoImpact: 8920
  },
  {
    id: '2',
    name: 'Electronics Plus',
    type: 'business',
    location: 'Dallas, TX',
    rating: 4.6,
    totalSales: 892,
    ecoImpact: 6540
  },
  {
    id: '3',
    name: 'Home Essentials Co.',
    type: 'business',
    location: 'Phoenix, AZ',
    rating: 4.7,
    totalSales: 1156,
    ecoImpact: 7230
  }
];