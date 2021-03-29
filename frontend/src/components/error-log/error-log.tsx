import { notification } from "antd";

export default function errorLog(err: any) {
  notification['error']({
    message: 'Error Message',
    description: err.toString(),
  });
};
