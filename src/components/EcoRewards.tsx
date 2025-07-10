import React from 'react';
import { Award, Leaf, TrendingUp, Gift, Star, Target } from 'lucide-react';

const EcoRewards: React.FC = () => {
  const userStats = {
    totalPurchases: 12,
    carbonSaved: 156,
    moneySaved: 1240,
    ecoPoints: 2850,
    level: 'Green Guardian',
    nextLevel: 'Sustainability Hero'
  };

  const achievements = [
    { name: 'First Purchase', icon: Star, completed: true, points: 50 },
    { name: 'Carbon Saver', icon: Leaf, completed: true, points: 100 },
    { name: 'Bulk Buyer', icon: TrendingUp, completed: false, points: 200 },
    { name: 'Community Champion', icon: Award, completed: false, points: 300 }
  ];

  const rewards = [
    { name: '5% off next purchase', cost: 500, available: true },
    { name: 'Free local delivery', cost: 750, available: true },
    { name: '10% off next purchase', cost: 1000, available: true },
    { name: 'Exclusive early access', cost: 1500, available: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco Rewards Dashboard</h1>
        <p className="text-gray-600">Track your environmental impact and earn rewards for sustainable choices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Carbon Saved</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.carbonSaved}kg</p>
            </div>
          </div>
          <p className="text-sm text-green-600">+12kg this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Eco Points</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.ecoPoints}</p>
            </div>
          </div>
          <p className="text-sm text-blue-600">+250 this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Money Saved</p>
              <p className="text-2xl font-bold text-gray-900">${userStats.moneySaved}</p>
            </div>
          </div>
          <p className="text-sm text-yellow-600">+$180 this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-lg font-bold text-gray-900">{userStats.level}</p>
            </div>
          </div>
          <p className="text-sm text-purple-600">Next: {userStats.nextLevel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.name} className={`flex items-center space-x-4 p-4 rounded-lg ${
                achievement.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className={`p-3 rounded-full ${
                  achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <achievement.icon className={`h-6 w-6 ${
                    achievement.completed ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.points} points</p>
                </div>
                {achievement.completed && (
                  <div className="text-green-600 font-medium">Completed</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Available Rewards</h2>
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div key={reward.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Gift className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{reward.name}</h3>
                    <p className="text-sm text-gray-600">{reward.cost} points</p>
                  </div>
                </div>
                <button
                  disabled={!reward.available || userStats.ecoPoints < reward.cost}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    reward.available && userStats.ecoPoints >= reward.cost
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {reward.available && userStats.ecoPoints >= reward.cost ? 'Claim' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoRewards;