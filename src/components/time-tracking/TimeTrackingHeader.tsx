
interface TimeTrackingHeaderProps {
  children?: React.ReactNode;
}

const TimeTrackingHeader = ({ children }: TimeTrackingHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Système de Pointage</h1>
        <p className="text-gray-600">Gestion des heures de travail</p>
      </div>
      {children}
    </div>
  );
};

export default TimeTrackingHeader;
