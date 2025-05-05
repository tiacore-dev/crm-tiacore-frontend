import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBill, updateBill, deleteBill } from "../../api/billsApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
// import { Button } from "antd";

export const useBillMutations = (
  bill_id: string,
  bank_account: string,
  bill_number: string,
  bill_date: number,
  contract: string,
  buyer: string,
  seller: string,
  company: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (newBill: {
      bill_number: string;
      bill_date: number;
      bank_account: string;
      contract?: string; // Указываем, что поле необязательное
      buyer: string;
      seller: string;
      company: string;
    }) => createBill(newBill),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["bills"],
      });
      navigate(`/bills/${data.bill_id}`);

      toast.success(
        <div>
          Счет успешно добавлен{" "}
          {/* <Button
            type="link"
            onClick={() => navigate(`/bills/${data.bill_id}`)}
          >
            Подробнее
          </Button> */}
        </div>
      );
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении счета");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      bill_id ? updateBill(bill_id, editedData) : Promise.reject(),
    onSuccess: () => {
      if (bill_id) {
        queryClient.invalidateQueries({
          queryKey: ["bill", bill_id],
        });
      }
      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => (bill_id ? deleteBill(bill_id) : Promise.reject()),
    onSuccess: () => {
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
