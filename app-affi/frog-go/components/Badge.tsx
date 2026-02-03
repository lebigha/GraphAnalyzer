"use client";

import { Trophy, Star, Zap, Target, TrendingUp, Award } from "lucide-react";

interface BadgeProps {
    type: 'first_analysis' | 'streak_3' | 'streak_7' | 'expert' | 'sharpshooter' | 'whale';
    earned?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const badgeConfig = {
    first_analysis: {
        icon: Star,
        name: "First Step",
        description: "Complete your first analysis",
        color: "from-yellow-400 to-orange-500",
    },
    streak_3: {
        icon: Zap,
        name: "On Fire",
        description: "3 analyses in a row",
        color: "from-orange-500 to-red-500",
    },
    streak_7: {
        icon: Trophy,
        name: "Dedicated",
        description: "7-day streak",
        color: "from-purple-500 to-pink-500",
    },
    expert: {
        icon: Target,
        name: "Expert",
        description: "10 successful analyses",
        color: "from-frog-green to-frog-cyan",
    },
    sharpshooter: {
        icon: TrendingUp,
        name: "Sharpshooter",
        description: "5 correct predictions",
        color: "from-blue-500 to-cyan-500",
    },
    whale: {
        icon: Award,
        name: "Whale",
        description: "Analyze $100k+ charts",
        color: "from-indigo-500 to-purple-500",
    },
};

export default function Badge({ type, earned = false, size = 'md' }: BadgeProps) {
    const config = badgeConfig[type];
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-20 h-20',
    };

    const iconSizes = {
        sm: 'w-5 h-5',
        md: 'w-7 h-7',
        lg: 'w-10 h-10',
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${earned
                    ? `bg-gradient-to-br ${config.color} shadow-lg`
                    : 'bg-gray-800 border border-gray-700'
                    } transition-all ${earned ? 'scale-100' : 'scale-95 opacity-50'}`}
            >
                <Icon className={`${iconSizes[size]} ${earned ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <span className={`text-xs font-medium ${earned ? 'text-white' : 'text-gray-500'}`}>
                {config.name}
            </span>
        </div>
    );
}

// Badge collection display
export function BadgeCollection({ earnedBadges }: { earnedBadges: string[] }) {
    const allBadges: BadgeProps['type'][] = ['first_analysis', 'streak_3', 'streak_7', 'expert', 'sharpshooter', 'whale'];

    return (
        <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-frog-cyan" />
                Your Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
                {allBadges.map((badge) => (
                    <Badge
                        key={badge}
                        type={badge}
                        earned={earnedBadges.includes(badge)}
                        size="sm"
                    />
                ))}
            </div>
        </div>
    );
}
