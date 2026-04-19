export const Loading = () => {
  return (
    <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
