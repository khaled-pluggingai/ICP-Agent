import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Building2, User, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanyData {
  full_name: string;
  country_name: string;
  company_name: string;
  company_linkedin: string;
  company_website: string;
}

interface CompanyResultProps {
  data: CompanyData;
  index?: number;
}

const CompanyResult: React.FC<CompanyResultProps> = ({ data, index = 0 }) => {
  const handleLinkClick = (url: string) => {
    if (url && url !== 'N/A' && url.trim() !== '') {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 backdrop-blur-sm">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-foreground">{data.company_name}</h3>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{data.country_name}</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-400/20">
              Match Found
            </Badge>
          </div>

          {/* Contact Person */}
          <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border/30">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Person</p>
              <p className="font-medium text-foreground">{data.full_name}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {data.company_website && data.company_website !== 'N/A' && data.company_website.trim() !== '' && (
              <Button
                variant="outline"
                onClick={() => handleLinkClick(data.company_website)}
                className="flex-1 border-border/50 hover:border-green-400/30 hover:bg-green-500/5"
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            )}
            {data.company_linkedin && data.company_linkedin !== 'N/A' && data.company_linkedin.trim() !== '' && (
              <Button
                variant="outline"
                onClick={() => handleLinkClick(data.company_linkedin)}
                className="flex-1 border-border/50 hover:border-blue-400/30 hover:bg-blue-500/5"
              >
                <div className="w-4 h-4 mr-2 bg-blue-500 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">in</span>
                </div>
                LinkedIn
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CompanyResult;