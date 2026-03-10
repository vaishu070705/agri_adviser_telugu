import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
  FarmerData, CropResult, DiseaseResult, YieldResult,
  HealthResult, EconomicsResult, WorkerProfile,
} from '@/models/types';
import { getAllFarmers, insertFarmer, getAllWorkersDb, insertWorker } from '@/services/databaseService';
import { toast } from 'sonner';

interface FarmerContextType {
  farmer: FarmerData | null;
  setFarmer: (f: FarmerData) => void;
  registerFarmer: (data: Omit<FarmerData, 'id' | 'registeredAt'>) => Promise<FarmerData | null>;
  cropResult: CropResult | null;
  setCropResult: (r: CropResult) => void;
  diseaseResult: DiseaseResult | null;
  setDiseaseResult: (r: DiseaseResult | null) => void;
  yieldResult: YieldResult | null;
  setYieldResult: (r: YieldResult) => void;
  healthResult: HealthResult | null;
  setHealthResult: (r: HealthResult) => void;
  economicsResult: EconomicsResult | null;
  setEconomicsResult: (r: EconomicsResult) => void;
  workers: WorkerProfile[];
  workersLoading: boolean;
  addWorker: (data: { name: string; email: string; phone: string; skills: string[]; district: string }) => Promise<WorkerProfile | null>;
  refreshWorkers: () => Promise<void>;
}

const FarmerContext = createContext<FarmerContextType>({
  farmer: null, setFarmer: () => {},
  registerFarmer: async () => null,
  cropResult: null, setCropResult: () => {},
  diseaseResult: null, setDiseaseResult: () => {},
  yieldResult: null, setYieldResult: () => {},
  healthResult: null, setHealthResult: () => {},
  economicsResult: null, setEconomicsResult: () => {},
  workers: [], workersLoading: true, addWorker: async () => null, refreshWorkers: async () => {},
});

export const FarmerProvider = ({ children }: { children: ReactNode }) => {
  const [farmer, setFarmer] = useState<FarmerData | null>(null);
  const [cropResult, setCropResult] = useState<CropResult | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [yieldResult, setYieldResult] = useState<YieldResult | null>(null);
  const [healthResult, setHealthResult] = useState<HealthResult | null>(null);
  const [economicsResult, setEconomicsResult] = useState<EconomicsResult | null>(null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);

  // Load workers and last farmer from database on mount
  useEffect(() => {
    refreshWorkers();
    loadLastFarmer();
  }, []);

  const loadLastFarmer = async () => {
    try {
      const farmers = await getAllFarmers();
      if (farmers.length > 0) {
        console.log('Loaded farmer from database:', farmers[0].name);
        setFarmer(farmers[0]);
      } else {
        console.log('No farmers found in database.');
      }
    } catch (err) {
      console.error('Error loading farmer:', err);
    }
  };

  const refreshWorkers = async () => {
    setWorkersLoading(true);
    const dbWorkers = await getAllWorkersDb();
    setWorkers(dbWorkers);
    setWorkersLoading(false);
  };

  const registerFarmer = async (data: Omit<FarmerData, 'id' | 'registeredAt'>): Promise<FarmerData | null> => {
    try {
      const result = await insertFarmer(data);
      if (result) {
        setFarmer(result);
        return result;
      }
      return null;
    } catch (err: any) {
      throw err;
    }
  };

  const addWorker = async (data: { name: string; email: string; phone: string; skills: string[]; district: string }): Promise<WorkerProfile | null> => {
    try {
      const result = await insertWorker(data);
      if (result) {
        await refreshWorkers();
        return result;
      }
      return null;
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <FarmerContext.Provider value={{
      farmer, setFarmer, registerFarmer,
      cropResult, setCropResult,
      diseaseResult, setDiseaseResult,
      yieldResult, setYieldResult,
      healthResult, setHealthResult,
      economicsResult, setEconomicsResult,
      workers, workersLoading, addWorker, refreshWorkers,
    }}>
      {children}
    </FarmerContext.Provider>
  );
};

export const useFarmer = () => useContext(FarmerContext);

export type { FarmerData, CropResult, DiseaseResult, YieldResult, HealthResult, EconomicsResult, WorkerProfile };
