import { createContext } from 'svelte';
import type { DesignFlags } from './design-flags';

export const [getDesignView, setDesignView, hasDesignView] = createContext<DesignFlags>();
