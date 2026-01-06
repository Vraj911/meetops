import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist or was moved.</p>
        <div className="flex gap-4 justify-center">
          <Button asChild><Link to={ROUTES.UPLOAD}>Go to Upload</Link></Button>
          <Button variant="outline" asChild><Link to={ROUTES.LOGIN}>Sign In</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
