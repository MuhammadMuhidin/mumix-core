import TwoFAToggle from "@/components/TwoFAToggle";

export default function ProfilePage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Profile Settings
      </h1>

      <TwoFAToggle />
    </div>
  );
}