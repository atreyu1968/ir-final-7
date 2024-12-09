import React, { useRef, useState } from 'react';
import { X, Download, Upload, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { ProfessionalFamily, Study, Group } from '../../types/masterRecords';

interface ImportError {
  row: number;
  field: string;
  message: string;
  data: any;
}

interface ImportStats {
  total: number;
  success: number;
  errors: number;
  timestamp: string;
}

interface FamilyImportProps {
  onImport: (families: Omit<ProfessionalFamily, 'id'>[]) => void;
  onClose: () => void;
}

const FamilyImport: React.FC<FamilyImportProps> = ({ onImport, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [stats, setStats] = useState<ImportStats | null>(null);

  const validateField = (value: any, field: string, row: number): ImportError | null => {
    if (!value) {
      return {
        row,
        field,
        message: 'Campo requerido',
        data: value,
      };
    }

    switch (field) {
      case 'code':
        if (!/^[A-Z]{2,5}$/.test(value)) {
          return {
            row,
            field,
            message: 'Código inválido (2-5 letras mayúsculas)',
            data: value,
          };
        }
        break;
      case 'level':
        if (!['basic', 'medium', 'higher'].includes(value)) {
          return {
            row,
            field,
            message: 'Nivel inválido (basic, medium, higher)',
            data: value,
          };
        }
        break;
    }
    return null;
  };

  const downloadTemplate = () => {
    const template = [{
      code: 'INF',
      name: 'Informática y Comunicaciones',
      description: 'Familia profesional de tecnologías de la información',
      studies: JSON.stringify([{
        code: 'DAW',
        name: 'Desarrollo de Aplicaciones Web',
        level: 'higher',
        groups: [{
          code: 'DAW1M',
          name: 'DAW 1º Mañana',
          shift: 'morning',
          year: 1
        }]
      }])
    }];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'plantilla_familias.xlsx');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setErrors([]);
    setStats(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const allErrors: ImportError[] = [];
          const familiesToImport: Omit<ProfessionalFamily, 'id'>[] = [];

          jsonData.forEach((row: any, index) => {
            const rowErrors: ImportError[] = [];
            
            // Validate required fields
            ['code', 'name', 'description'].forEach(field => {
              const error = validateField(row[field], field, index + 2);
              if (error) rowErrors.push(error);
            });

            // Parse and validate studies
            let studies: Study[] = [];
            try {
              const parsedStudies = JSON.parse(row.studies || '[]');
              studies = parsedStudies.map((study: any) => ({
                id: Date.now().toString() + Math.random(),
                code: study.code,
                name: study.name,
                level: study.level,
                groups: (study.groups || []).map((group: any) => ({
                  id: Date.now().toString() + Math.random(),
                  code: group.code,
                  name: group.name,
                  shift: group.shift,
                  year: group.year,
                  studyId: study.id
                }))
              }));
            } catch (error) {
              rowErrors.push({
                row: index + 2,
                field: 'studies',
                message: 'Formato de estudios inválido',
                data: row.studies,
              });
            }

            if (rowErrors.length === 0) {
              familiesToImport.push({
                code: row.code,
                name: row.name,
                description: row.description,
                studies,
              });
            } else {
              allErrors.push(...rowErrors);
            }
          });

          setErrors(allErrors);
          setStats({
            total: jsonData.length,
            success: familiesToImport.length,
            errors: allErrors.length,
            timestamp: new Date().toISOString(),
          });

          if (familiesToImport.length > 0) {
            onImport(familiesToImport);
          }
        } catch (error) {
          console.error('Error processing file:', error);
          setErrors([{
            row: 0,
            field: 'file',
            message: 'Error al procesar el archivo',
            data: null,
          }]);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setErrors([{
        row: 0,
        field: 'file',
        message: 'Error al leer el archivo',
        data: null,
      }]);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Importar Familias Profesionales</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Plantilla</span>
            </button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                <span>{importing ? 'Importando...' : 'Seleccionar Archivo'}</span>
              </button>
            </div>
          </div>

          {stats && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen de Importación</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-semibold">{stats.total}</div>
                </div>
                <div>
                  <div className="text-sm text-green-600">Correctos</div>
                  <div className="text-xl font-semibold text-green-600">{stats.success}</div>
                </div>
                <div>
                  <div className="text-sm text-red-600">Con Errores</div>
                  <div className="text-xl font-semibold text-red-600">{stats.errors}</div>
                </div>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-medium">Errores de Validación</h3>
              </div>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-600">
                    Fila {error.row}: {error.message} ({error.field})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p className="mb-2">Instrucciones:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Descarga la plantilla Excel para ver el formato requerido</li>
              <li>Los campos code, name y description son obligatorios</li>
              <li>El código debe ser 2-5 letras mayúsculas</li>
              <li>Los estudios deben estar en formato JSON válido</li>
              <li>Los niveles válidos son: basic, medium, higher</li>
              <li>Los turnos válidos son: morning, afternoon, evening</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyImport;