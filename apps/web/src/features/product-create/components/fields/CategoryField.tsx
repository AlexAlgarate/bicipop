import { FieldError } from '@/components/FieldError';
import { Category } from '../../types';

interface CategorySelectFieldProps {
  categories: Category[];
  error?: string[];
  defaultValue?: string | number;
}

export const CategorySelectField = ({
  categories,
  error,
  defaultValue,
}: CategorySelectFieldProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor="categoryId" className="text-sm font-medium">
        ¿Qué tipo de bici es?
      </label>

      <div className="relative">
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={defaultValue}
          className={[
            'w-full appearance-none bg-background rounded-lg border px-3 py-2 text-sm',
            'focus:ring-2 focus:outline-none cursor-pointer',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border focus:ring-primary/20',
          ].join(' ')}
        >
          <option value="" disabled hidden>
            Selecciona el estilo (ej: Carretera, MTB...)
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      <FieldError error={error} />

      <p className="text-xs text-muted-foreground">
        {'* Si es una E-bike de montaña, te sugerimos la categoría "Montaña"'}
      </p>
    </div>
  );
};
