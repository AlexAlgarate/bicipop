interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
      <h3 className="font-semibold text-lg md:text-xl mb-3">Descripción</h3>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
};
