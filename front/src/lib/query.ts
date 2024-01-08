import { Result } from './result';

type ParsedQuery = {
	name: string;
	labels: Record<string, string | number>;
};

export function tryParseQuery(query: string): Result<ParsedQuery, string> {
	const [name, labels] = query.split('{');
	try {
		return Result.ok<ParsedQuery, string>({
			name,
			labels: JSON.parse(`{${labels}`)
		});
	} catch (e) {
		return Result.err<ParsedQuery, string>(e.message);
	}
}
