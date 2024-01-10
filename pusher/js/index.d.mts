export default class Pusher {
  constructor(host: string);

  pushMetric(
    name: string,
    value: number,
    labels: Record<string, string | number>
  ): Promise<void>;
}
