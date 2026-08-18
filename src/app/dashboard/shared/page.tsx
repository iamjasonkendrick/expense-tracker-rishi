import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaceholderPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Feature Module</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            The backend API contracts and database schemas for this module are fully designed and
            ready. The frontend UI implementation is scheduled for the next sprint.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
