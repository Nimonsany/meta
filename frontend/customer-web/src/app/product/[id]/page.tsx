export default function ProductPage({
  params,
}: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Product {params.id}
        </h1>
        <p className="text-gray-600">
          Details for product ID: {params.id}
        </p>
      </section>
    </main>
  );
}