import React, { useRef, useState } from 'react';
import { X, Download, Upload, AlertCircle, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Center } from '../../types/masterRecords';

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

interface CenterImportProps {
  onImport: (centers: Omit<Center, 'id' | 'network'>[]) => void;
  onClose: () => void;
}

const CenterImport: React.FC<CenterImportProps> = ({ onImport, onClose }) => {
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
        if (!/^[A-Z0-9-]+$/.test(value)) {
          return {
            row,
            field,
            message: 'Código inválido (solo mayúsculas, números y guiones)',
            data: value,
          };
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return {
            row,
            field,
            message: 'Email inválido',
            data: value,
          };
        }
        break;
      case 'phone':
        if (!/^\d{9}$/.test(value)) {
          return {
            row,
            field,
            message: 'Teléfono inválido (9 dígitos)',
            data: value,
          };
        }
        break;
    }
    return null;
  };

  const downloadTemplate = () => {
    const template = [{
      code: 'CIFP-001',
      name: 'CIFP Ejemplo',
      address: 'Calle Principal, 123',
      municipality: 'Santa Cruz',
      province: 'Santa Cruz de Tenerife',
      island: 'Tenerife',
      phone: '922123456',
      email: 'ejemplo@edu.es',
    }];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'plantilla_centros.xlsx');
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

          // Validate all rows
          const allErrors: ImportError[] = [];
          const centersToImport: Omit<Center, 'id' | 'network'>[] = [];

          jsonData.forEach((row: any, index) => {
            const rowErrors: ImportError[] = [];
            
            // Required fields
            ['code', 'name', 'address', 'municipality', 'province', 'island', 'phone', 'email'].forEach(field => {
              const error = validateField(row[field], field, index + 2);
              if (error) rowErrors.push(error);
            });

            if (rowErrors.length === 0) {
              centersToImport.push({
                code: row.code,
                name: row.name,
                address: row.address,
                municipality: row.municipality,
                province: row.province,
                island: row.island,
                phone: row.phone,
                email: row.email,
              });
            } else {
              allErrors.push(...rowErrors);
            }
          });

          setErrors(allErrors);
          setStats({
            total: jsonData.length,
            success: centersToImport.length,
            errors: allErrors.length,
            timestamp: new Date().toISOString(),
          });

          if (centersToImport.length > 0) {
            onImport(centersToImport);
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
          <h2 className="text-lg font-semibold">Importar Centros</h2>
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
              <li>Todos los campos son obligatorios</li>
              <li>El código debe contener solo mayúsculas, números y guiones</li>
              <li>El teléfono debe tener 9 dígitos</li>
              <li>La red se asignará después de la importación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterImport;