import React from 'react';
import { Target, Globe } from 'lucide-react';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import type { Action } from '../../../types/action';

interface ObjectivesProps {
  data: Partial<Action>;
  onChange: (data: Partial<Action>) => void;
}

const Objectives: React.FC<ObjectivesProps> = ({ data, onChange }) => {
  const { objectives, centerObjectives, ods } = useMasterRecordsStore();

  // Get active objectives and ODS
  const activeNetworkObjectives = objectives.filter(obj => obj.isActive);
  const activeCenterObjectives = centerObjectives.filter(obj => obj.isActive && obj.center === data.center);
  const activeODS = ods.filter(obj => obj.isActive);

  const handleNetworkObjectiveChange = (objectiveId: string, checked: boolean) => {
    const currentObjectives = data.objectives || [];
    const newObjectives = checked
      ? [...currentObjectives, objectiveId]
      : currentObjectives.filter(id => id !== objectiveId);
    onChange({ objectives: newObjectives });
  };

  const handleCenterObjectiveChange = (objectiveId: string, checked: boolean) => {
    const currentObjectives = data.centerObjectives || [];
    const newObjectives = checked
      ? [...currentObjectives, objectiveId]
      : currentObjectives.filter(id => id !== objectiveId);
    onChange({ centerObjectives: newObjectives });
  };

  const handleODSChange = (odsId: string, checked: boolean) => {
    const currentODS = data.ods || [];
    const newODS = checked
      ? [...currentODS, odsId]
      : currentODS.filter(id => id !== odsId);
    onChange({ ods: newODS });
  };

  return (
    <div className="space-y-6">
      {/* Objetivos de Red */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Objetivos de Red
        </h3>
        <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
          {activeNetworkObjectives.map(objective => (
            <label key={objective.id} className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={(data.objectives || []).includes(objective.id)}
                onChange={(e) => handleNetworkObjectiveChange(objective.id, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{objective.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    objective.priority === 'high' ? 'bg-red-100 text-red-700' :
                    objective.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {objective.priority === 'high' ? 'Alta' :
                     objective.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{objective.description}</p>
              </div>
            </label>
          ))}
          {activeNetworkObjectives.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-2">
              No hay objetivos de red activos disponibles
            </p>
          )}
        </div>
      </div>

      {/* Objetivos de Centro */}
      {data.center && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Objetivos de Centro
          </h3>
          <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
            {activeCenterObjectives.map(objective => (
              <label key={objective.id} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={(data.centerObjectives || []).includes(objective.id)}
                  onChange={(e) => handleCenterObjectiveChange(objective.id, e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{objective.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      objective.priority === 'high' ? 'bg-red-100 text-red-700' :
                      objective.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {objective.priority === 'high' ? 'Alta' :
                       objective.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{objective.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Categoría: {objective.category}</p>
                </div>
              </label>
            ))}
            {activeCenterObjectives.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                No hay objetivos de centro activos disponibles
              </p>
            )}
          </div>
        </div>
      )}

      {/* ODS */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Objetivos de Desarrollo Sostenible (ODS)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {activeODS.map(ods => (
            <label key={ods.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={(data.ods || []).includes(ods.id)}
                onChange={(e) => handleODSChange(ods.id, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{ods.name}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{ods.description}</p>
              </div>
            </label>
          ))}
        </div>
        {activeODS.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No hay ODS activos disponibles
          </p>
        )}
      </div>
    </div>
  );
};

export default Objectives;