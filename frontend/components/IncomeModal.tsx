"use client";
import React, { useState } from "react";
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
import { ChevronDownIcon, Divide } from "lucide-react";
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
import { INCOME_CATEGORY_CONSTATNS } from "@/utils/constants";
import { Calendar } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

function IncomeModal({onAddIncome}: {onAddIncome: (incomeData: ITransactionData) => void}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("💰");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const handleEmojiSelect = (emojiObj: EmojiObject) => {
    setSelectedEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const handleAddIncome = () => {
    const incomeData : ITransactionData = {
      emoji: selectedEmoji,
      title,
      category,
      amount,
      date,
    }

    if(!selectedEmoji || !title || !category || !amount || !date){
      toast.error("Please fill in all fields");
      return;
    }
    onAddIncome(incomeData);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add income</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Add income to the list in just a few simple steps{" "}
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
            <span className="font-medium">Title</span>
            <Input
              className="mt-2"
              placeholder="Enter income title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-full">
            <span className="font-medium">Category</span>
            <Select
              onValueChange={(value) => setCategory(value)}
              value={category}
            >
              <SelectTrigger className="mt-2 w-full cursor-pointer">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>

                  {INCOME_CATEGORY_CONSTATNS.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                      className="cursor-pointer"
                    >
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <span className="font-medium">Amount</span>
            <Input
              className="mt-2"
              placeholder="Enter amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <span className="font-medium">Date</span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="cursor">
                <Button variant="outline" className="flex justify-between">
                  {date ? new Date(date).toLocaleDateString() : "Select date" }
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {setDate(date ?? null);
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
          <Button className="cursor-pointer" onClick={handleAddIncome}>Add Income</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default IncomeModal;
