export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm text-muted-foreground py-4 mt-10">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} FoodManage. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/terms" className="hover:underline">
            Terms
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
