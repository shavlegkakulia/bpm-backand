export default class AppError extends Error {
  constructor(props: any) {
    super(props);
    this.code = props.code;
    this.data = props.data;
  }
  code: number;
  data: any[] | undefined;
}
