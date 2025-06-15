
interface LeaveRequestsHeaderProps {
  isManager: boolean;
  children?: React.ReactNode;
}

const LeaveRequestsHeader = ({ isManager, children }: LeaveRequestsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Demandes de congés</h1>
        <p className="text-gray-600">
          {isManager ? 'Gérer les demandes de congés' : 'Mes demandes de congés'}
        </p>
      </div>
      {children}
    </div>
  );
};

export default LeaveRequestsHeader;
