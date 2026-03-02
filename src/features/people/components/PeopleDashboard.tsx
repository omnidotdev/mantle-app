import { Card } from "@/components/ui/card";
import { usePeopleStore } from "@/features/people/store/peopleStore";
import NetworkGraph from "./NetworkGraph";

const PeopleDashboard = () => {
  const { people, companies } = usePeopleStore();

  const totalPeople = people.length;
  const internalCount = people.filter((p) => p.internal).length;
  const externalCount = totalPeople - internalCount;
  const totalCompanies = companies.length;

  // Tag distribution
  const tagCounts = people.reduce<Record<string, number>>((acc, p) => {
    for (const tag of p.tags ?? []) {
      acc[tag] = (acc[tag] ?? 0) + 1;
    }
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card title="Total People" className="text-center">
          <p className="font-bold text-3xl text-teal-600">{totalPeople}</p>
        </Card>
        <Card title="Internal" className="text-center">
          <p className="font-bold text-3xl text-blue-600">{internalCount}</p>
        </Card>
        <Card title="External" className="text-center">
          <p className="font-bold text-3xl text-purple-600">{externalCount}</p>
        </Card>
        <Card title="Companies" className="text-center">
          <p className="font-bold text-3xl text-gray-700">{totalCompanies}</p>
        </Card>
      </div>

      {/* Top tags */}
      {topTags.length > 0 && (
        <Card title="Top Tags">
          <div className="flex flex-wrap gap-3">
            {topTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 text-sm">
                  {tag}
                </span>
                <span className="text-gray-400 text-sm">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Network graph */}
      <NetworkGraph people={people} />
    </div>
  );
};

export default PeopleDashboard;
