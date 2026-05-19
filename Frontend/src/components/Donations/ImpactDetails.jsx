export default function ImpactDetails({ amount }) {
  if (!amount) return null;

  const impactUnits = Math.floor(amount / 100);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Your Impact</h3>
      <div className="mt-3 space-y-2 text-gray-600">
        <p>✔ {impactUnits} meals provided</p>
        <p>✔ {Math.floor(impactUnits / 2)} days of support</p>
        <p>✔ Helps in medical assistance</p>
      </div>
    </div>
  );
}