interface ErrorNotificationProps {
    error: string;
  }
  
  /**
   * Error notification component
   */
  export function ErrorNotification({ error }: ErrorNotificationProps) {
    if (!error) return null;
  
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        {error}
      </div>
    );
  }
  
  export default ErrorNotification;