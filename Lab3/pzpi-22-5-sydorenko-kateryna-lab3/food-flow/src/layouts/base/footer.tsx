export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm text-muted-foreground py-4 mt-10">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} FoodManage. All rights reserved.</p>
      </div>
    </footer>
  );
}
