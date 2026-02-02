"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Modal";
import { Button } from "./ui/Button";
import { ChevronDownIcon } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { EmojiObject, ITransactionData } from "@/utils/types";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { INCOME_CATEGORY_CONSTATNS, EXPENSE_CATEGORY_CONSTATNS } from "@/utils/constants";
import { Calendar } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

function TransactionModal({
  onAddTransaction,
  onUpdateTransaction,
  showTransactionModal,
  setShowTransactionModal,
  transactionObj,
  isEditMode,
  setIsEditMode,
}: {
  onAddTransaction: (data: ITransactionData) => void | Promise<void>;
  onUpdateTransaction: (data: ITransactionData) => void | Promise<void>;
  showTransactionModal: boolean;
  setShowTransactionModal: (value: boolean) => void;
  transactionObj: ITransactionData | null;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(transactionObj?.emoji || "💰");
  const [title, setTitle] = useState(transactionObj?.title || "");
  const [category, setCategory] = useState(transactionObj?.category || "");
  const [amount, setAmount] = useState(transactionObj?.amount || "");
  const [date, setDate] = useState<Date | null>(transactionObj?.date || null);
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'Income' | 'Expense'>(transactionObj?.transactionType || "Income");
  const modalTitle = isEditMode
    ? (transactionType === "Income" ? "Update Income" : "Update Expense")
    : (transactionType === "Income" ? "Add Income" : "Add Expense");
  const categories = transactionType === "Income" ? INCOME_CATEGORY_CONSTATNS : EXPENSE_CATEGORY_CONSTATNS;

  const handleEmojiSelect = (emojiObj: EmojiObject) => {
    setSelectedEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const handleAdd = async () => {
    const data: ITransactionData = {
      emoji: selectedEmoji,
      title,
      category,
      amount,
      date,
      transactionType,
      _id: transactionObj?._id,
    };

    if (!selectedEmoji || !title || !category || !amount || !date || !transactionType) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isEditMode) {
      await onUpdateTransaction(data);
      setShowTransactionModal(false);
    } else {
      await onAddTransaction(data);
      setShowTransactionModal(false);
    }
  };

  const handleReset = () => {
    setSelectedEmoji("💰");
    setTitle("");
    setCategory("");
    setAmount("");
    setDate(null);
    setTransactionType("Income");
  };

  const handleOpen = () => {
    setShowTransactionModal(!showTransactionModal);
    if (!showTransactionModal) handleReset();
  };

  useEffect(() => {
    if (transactionObj) {
      setSelectedEmoji(transactionObj.emoji);
      setTitle(transactionObj.title);
      setCategory(transactionObj.category);
      setAmount(transactionObj.amount);
      setDate(transactionObj.date);
      setTransactionType(transactionObj.transactionType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionObj]);

  return (
    <Dialog open={showTransactionModal} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>
            Add a transaction (income or expense) in just a few simple steps
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-start justify-center gap-4">
            <div className="relative">
            <span
              className="text-4xl border border-gray-300 py-1 px-2 rounded-md cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectedEmoji}
            </span>
            {showEmojiPicker ? (
              <div className="absolute top-[-8] left-18">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            ) : null}
          </div>
          <div className="w-full">
            <span className="font-medium">Type</span>
            <Select onValueChange={(v) => { setTransactionType(v); setCategory(""); }} value={transactionType}>
              <SelectTrigger className="mt-2 w-full cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Transaction type</SelectLabel>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          

          <div className="w-full">
            <span className="font-medium">Title</span>
            <Input className="mt-2" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="w-full">
            <span className="font-medium">Category</span>
            <Select onValueChange={(value) => setCategory(value)} value={category}>
              <SelectTrigger className="mt-2 w-full cursor-pointer">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="cursor-pointer">
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <span className="font-medium">Amount</span>
            <Input className="mt-2" placeholder="Enter amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="w-full flex flex-col gap-2">
            <span className="font-medium">Date</span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="cursor">
                <Button variant="outline" className="flex justify-between">
                  {date ? new Date(date).toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <Calendar
                  mode="single"
                  selected={date ?? undefined}
                  onSelect={(date) => {
                    setDate(date ?? null);
                    setOpen(false);
                  }}
                  className="rounded-lg border"
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button className="cursor-pointer" onClick={handleAdd}>
            {isEditMode ? "Update Transaction" : "Add Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TransactionModal;
