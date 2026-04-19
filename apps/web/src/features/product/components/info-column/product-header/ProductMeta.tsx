import { Clock, MapPin } from 'lucide-react';

interface ProductMetaProps {
  location: string;
  publishedAgo: string;
}

export const ProductMeta = ({ location, publishedAgo }: ProductMetaProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        <span>{location}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>Publicado hace {publishedAgo}</span>
      </div>
    </div>
  );
};
