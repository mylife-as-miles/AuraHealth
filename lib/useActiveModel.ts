import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

/**
 * Model ID → Display Name map.
 * Single source of truth for model display names across the app.
 */
const MODEL_NAMES: Record<string, string> = {
    'medgemma-4b-it': 'MedGemma 27B',
    'biomedclip': 'BiomedCLIP',
    'med-palm-2': 'Med-PaLM 2',
    'biogpt': 'BioGPT',
    'chexagent': 'CheXagent',
    'llava-med': 'LLaVA-Med',
    'meditron': 'Meditron',
    'pmc-llama': 'PMC-LLaMA',
    'med-flamingo': 'Med-Flamingo',
    'biomedlm': 'BioMedLM',
    'clinical-camel': 'Clinical Camel',
    'medsiglip-v1': 'MedSigLIP',
    'alphagenome': 'AlphaGenome',
    'baichuan-m3': 'Baichuan-M3',
};

const DEFAULT_MODEL_ID = 'medgemma-4b-it';
const DEFAULT_MODEL_NAME = 'MedGemma 27B';

/**
 * Hook that returns the currently active model's ID and display name.
 * Reads from Dexie userSettings, falls back to default if nothing is set.
 */
export function useActiveModel() {
    const settings = useLiveQuery(() => db.userSettings.get('user-settings'), []);

    const activeModels = settings?.activeModels || {};
    const activeId = Object.keys(activeModels).find(k => activeModels[k]) || DEFAULT_MODEL_ID;
    const activeName = MODEL_NAMES[activeId] || activeId;

    return { modelId: activeId, modelName: activeName };
}

/**
 * Get display name for a model ID (non-hook version for use outside React).
 */
export function getModelDisplayName(id: string): string {
    return MODEL_NAMES[id] || id;
}
