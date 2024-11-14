// blogs/layout.tsx
import React, { ReactNode } from "react";

interface BlogLayoutProps {
  children: ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main>{children}</main>
    </div>
  );
};

export default BlogLayout;
