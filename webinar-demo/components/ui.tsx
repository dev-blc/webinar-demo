import React from "react"

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-secondary hover:bg-secondary/80 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = "Button"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} ref={ref} {...props}>
      {children}
    </div>
  ),
)
Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} ref={ref} {...props}>
      {children}
    </div>
  ),
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} ref={ref} {...props}>
      {children}
    </h3>
  ),
)
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p className={`text-sm text-muted-foreground ${className}`} ref={ref} {...props}>
      {children}
    </p>
  ),
)
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div className={`p-6 pt-0 ${className}`} ref={ref} {...props}>
      {children}
    </div>
  ),
)
CardContent.displayName = "CardContent"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      ref={ref}
      {...props}
    />
  ),
)
Label.displayName = "Label"

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table className={`w-full border-collapse text-sm ${className}`} ref={ref} {...props} />
  ),
)
Table.displayName = "Table"

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead className={`[&_tr:last-child]:border-0 border-b ${className}`} ref={ref} {...props} />
  ),
)
TableHeader.displayName = "TableHeader"

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`} ref={ref} {...props} />
  ),
)
TableBody.displayName = "TableBody"

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
      ref={ref}
      {...props}
    />
  ),
)
TableRow.displayName = "TableRow"

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      ref={ref}
      {...props}
    />
  ),
)
TableHead.displayName = "TableHead"

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pl-0 ${className}`} ref={ref} {...props} />
  ),
)
TableCell.displayName = "TableCell"

export const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 ${className}`}
      ref={ref}
      {...props}
    />
  ),
)
Badge.displayName = "Badge"

export const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div className={className} ref={ref} {...props}>
      {children}
    </div>
  ),
)
Tabs.displayName = "Tabs"

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      className={`inline-flex items-center justify-center rounded-md p-1 text-muted-foreground data-[orientation=horizontal]:space-x-1 data-[orientation=vertical]:space-y-1 bg-muted/50 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
)
TabsList.displayName = "TabsList"

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  ),
)
TabsTrigger.displayName = "TabsTrigger"

export const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
)
TabsContent.displayName = "TabsContent"
