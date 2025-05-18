
import { Component, type OnInit } from "@angular/core"
import type { EmailMessage } from "../../Models/EmailMessage"

import type { EmailRequest } from "../../Models/EmailRequest"
import { MatIconModule } from "@angular/material/icon"
import { MatListModule } from "@angular/material/list"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { FormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatMenuModule } from "@angular/material/menu"
import { MatBadgeModule } from "@angular/material/badge"
import { CommonModule } from "@angular/common"
import { DatePipe } from "@angular/common"
import { finalize } from "rxjs/operators"
import { EmailService } from "../../Services/email.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-inbox",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,

  ],
  templateUrl: "./inbox.component.html",
  styleUrl: "./inbox.component.css",
})
export class InboxComponent implements OnInit {
  emails: EmailMessage[] = []
  filteredEmails: EmailMessage[] = []
  selectedEmail?: EmailMessage
  replyText = ""
  loading = false
  searchQuery = ""

  // Add these properties to the InboxComponent class
  showComposeDialog = false
  newEmail: EmailRequest = {
    to: "",
    subject: "",
    body: "",
  }

  constructor(
    private emailService: EmailService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadEmails()
  }

  loadEmails(): void {
    this.loading = true
    this.emailService
      .getUnreadEmails()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((emails) => {
        this.emails = emails
        this.filteredEmails = [...emails]
        this.sortEmails()
      })
  }

  sortEmails(): void {
    this.filteredEmails.sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date || Date.now()).getTime() - new Date(a.date || Date.now()).getTime()
    })
  }

  selectEmail(email: EmailMessage): void {
    this.selectedEmail = email
    if (!email.isRead) {
      this.markAsRead(email, false)
    }
  }

  markAsRead(email: EmailMessage, showNotification = true): void {
    this.emailService.markAsRead(email.id).subscribe(() => {
      email.isRead = true
      if (showNotification) {
        this.snackBar.open("Marked as read", "Close", {
          duration: 2000,
          panelClass: "success-snackbar",
        })
      }
    })
  }

  sendReply(): void {
    if (!this.selectedEmail || !this.replyText.trim()) return

    const reply: EmailRequest = {
      to: this.selectedEmail.from,
      subject: `RE: ${this.selectedEmail.subject}`,
      body: this.replyText,
    }

    this.loading = true
    this.emailService
      .sendEmail(reply)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.snackBar.open("Reply sent successfully", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
        this.replyText = ""
      })
  }

  deleteEmail(email: EmailMessage, event?: Event): void {
    if (event) {
      event.stopPropagation()
    }

    this.loading = true
    this.emailService
      .deleteEmail(email.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.snackBar.open("Email deleted", "Close", {
          duration: 2000,
          panelClass: "success-snackbar",
        })

        this.emails = this.emails.filter((e) => e.id !== email.id)
        this.filteredEmails = this.filteredEmails.filter((e) => e.id !== email.id)

        if (this.selectedEmail?.id === email.id) {
          this.selectedEmail = undefined
        }
      })
  }

  refreshInbox(): void {
    this.loadEmails()
    this.snackBar.open("Inbox refreshed", "Close", { duration: 2000 })
  }

  searchEmails(): void {
    if (!this.searchQuery.trim()) {
      this.filteredEmails = [...this.emails]
    } else {
      const query = this.searchQuery.toLowerCase()
      this.filteredEmails = this.emails.filter(
        (email) =>
          email.subject.toLowerCase().includes(query) ||
          email.from.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query),
      )
    }
    this.sortEmails()
  }

  clearSearch(): void {
    this.searchQuery = ""
    this.filteredEmails = [...this.emails]
    this.sortEmails()
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  getFormattedDate(dateString?: string): string {
    if (!dateString) return ""

    const date = new Date(dateString)
    const today = new Date()

    // If the email is from today, show only the time
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If the email is from this year, show the month and day
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    // Otherwise show the full date
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
  }

  getUnreadCount(): number {
    return this.emails.filter((email) => !email.isRead).length
  }

  // Add these methods to the InboxComponent class
  openComposeDialog(): void {
    this.showComposeDialog = true
    this.newEmail = {
      to: "",
      subject: "",
      body: "",
    }
  }

  closeComposeDialog(): void {
    this.showComposeDialog = false
  }

  minimizeComposeDialog(): void {
    // In a real app, this would minimize the dialog
    // For now, we'll just close it
    this.closeComposeDialog()
  }

  maximizeComposeDialog(): void {
    // In a real app, this would maximize the dialog
    // This is just a placeholder
  }

  sendNewEmail(): void {
    if (!this.newEmail.to || !this.newEmail.subject || !this.newEmail.body) {
      this.snackBar.open("Please fill in all fields", "Close", {
        duration: 3000,
        panelClass: "error-snackbar",
      })
      return
    }

    this.loading = true
    this.emailService
      .sendEmail(this.newEmail)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.snackBar.open("Email sent successfully", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
        this.closeComposeDialog()
      })
  }
}
