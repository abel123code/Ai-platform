export function Card({ children, className }) {
    return (
      <div className={`bg-gray-800 border-gray-700 flex flex-col ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ title, description }) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    );
  }
  
  export function CardContent({ children }) {
    return (
      <div className="p-4 flex-1">
        {children}
      </div>
    );
  }
  
  export function CardFooter({ children }) {
    return (
      <div className="p-4 mt-auto">
        {children}
      </div>
    );
  }
  