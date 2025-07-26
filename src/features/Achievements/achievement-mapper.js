import { Calendar, Award, Target, PiggyBank, Star, Sun, ShieldCheck, BookOpen, HeartPulse } from 'lucide-react';

export const mapApiToFeAchievement = (templateDto) => {
    let icon = Star; // Icon mặc định
    let tier = 'bronze'; // Tier mặc định

    // Logic để chọn icon và tier dựa trên category và threshold
    switch (templateDto.category) {
        case 'money':
            icon = PiggyBank;
            if (templateDto.threshold >= 5000000) tier = 'gold';
            else if (templateDto.threshold >= 1000000) tier = 'silver';
            break;
        case 'time':
            icon = Calendar;
            if (templateDto.threshold >= 30) tier = 'gold';
            else if (templateDto.threshold >= 14) tier = 'silver';
            break;
        case 'mission':
            icon = Target;
            if (templateDto.threshold >= 50) tier = 'gold';
            else if (templateDto.threshold >= 20) tier = 'silver';
            break;
        case 'diary':
            icon = BookOpen;
            if (templateDto.threshold >= 30) tier = 'gold';
            else if (templateDto.threshold >= 7) tier = 'silver';
            break;
        default:
            icon = Award;
    }

    return {
        ...templateDto, 
        icon: icon,      
        tier: tier       
    };
};