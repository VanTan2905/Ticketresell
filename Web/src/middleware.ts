import { NextResponse, NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export async function middleware(request: NextRequest) {
  // Get the access key from cookies
  const accessKey = request.cookies.get(".AspNetCore.Session")?.value;

  // Define role-based access for each route
  const roleMap: { [key: string]: string } = {
    "/admin": "RO4",
    "/staff": "RO3",
    "/sell": "RO2",
    "/profileuser": "RO1",
    "/favorites": "RO1",
    "/history": "RO1",
    "/my-ticket": "RO1",
    "/settings": "RO1",
    "/requestchat": "RO1",
  };

  // Find the appropriate route for the requested path
  const matchedRoute = Object.keys(roleMap).find((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Get the roleId for the matched route
  const roleId = matchedRoute ? roleMap[matchedRoute] : null;

  console.log(roleId);

  // If the route requires a roleId but it was not found, continue to next middleware
  if (!roleId) return NextResponse.next();

  // Validate the user's session and role
  // Construct the URL with the roleId as a query parameter
  const validateUrl = `http://${process.env.API_URL}/api/Authentication/isRolelogged?roleId=${roleId}`;
  console.log(validateUrl);
  console.log("Access key: ", accessKey);
  const validate = await fetch(validateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `.AspNetCore.Session=${accessKey};`,
    },
    // Remove the body since we're now sending roleId in the URL
  });

  console.log("Why fetch fail");

  const response = await validate.json();
  console.log(response);
  // Redirect if access is denied
  if (response.message === "False") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue to the requested page if authenticated and authorized
  return NextResponse.next();
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: [
    "/profileuser/:path*",
    "/favorites/:path*",
    "/history/:path*",
    "/my-ticket/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/sell/:path*",
    "/staff/:path*",
    "/requestchat/:path*",
  ],
};
