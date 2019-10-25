using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Tinifier.Core.Models.Services;

namespace Tinifier.Core.Services.EmailSender
{
    public interface IReportSender
    {
        Task<string> SendReportAsync(ReportModel model);
    }
    public class ReportSender : IReportSender
    {
        public async Task<string> SendReportAsync(ReportModel model)
        {

            var client = new SendGridClient("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");
            var from = new EmailAddress(model.Email, model.Name);
            var subject = "Tinifier 2.0 Report";
            var to = new EmailAddress("shalamov.stas1992@gmail.com", "Tinifier");
            var plainTextContent = $"";
            var htmlContent = GenerateEmailBody(model);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            return response.StatusCode.ToString();
        }

        private string GenerateEmailBody(ReportModel model)
        {
            StringBuilder stringBuilder = new StringBuilder();

            var color = "#339966";

            stringBuilder.Append($"<p style=\"font-size: 25px; text-align: center\"><strong>Tinifier 2.0<br>{model.Type}</strong></p>");

            stringBuilder.Append($"<div style=\"border: 1px solid {color}; margin-bottom: 10px\">");

            stringBuilder.Append($"<div style=\"background: {color}; font-size: 25px; color: white\">");
            stringBuilder.Append($"<p style=\"margin: 0px; padding: 5px; \"><strong>Description</strong></p></div>");


            stringBuilder.Append($"<div style=\"padding: 5px; \"><p>{model.Description}</p></div>");
            stringBuilder.Append($"</div>");


            return stringBuilder.ToString();
        }
    }
}