import type { AggFunction } from './types';
import { PUBLIC_MICROEYE_SAMEORIGIN } from '$env/static/public';

export const AGG_FUNCTIONS: AggFunction[] = ['avg', 'min', 'max', 'sum', 'count'];
export const HOST =
	Number(PUBLIC_MICROEYE_SAMEORIGIN) === 1 ? window.location.origin : 'http://localhost:3000';
