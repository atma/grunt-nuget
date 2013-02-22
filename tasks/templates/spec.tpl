<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
        <id><%= pkg.name %><% if(identity) { %>.<%= identity %><% } %></id>
        <version><%= pkg.version %></version>
        <title><%= pkg.title ? pkg.title : pkg.name %><% if(identity) { %> <%= identity %><% } %></title>
        <% if (pkg.author) { %>
        <authors><%= pkg.author.name %></authors>
        <% } else if (pkg.authors) { %>
        <authors><% var authors = pkg.authors.map(function(author) {return author.name} ); %><%= authors.join(', ') %></authors>
        <% } %>
        <owners />
        <% if(pkg.homepage) { %><projectUrl><%= pkg.homepage %></projectUrl><% } %>
        <requireLicenseAcceptance>false</requireLicenseAcceptance>
        <description><%= pkg.description %></description>
        <copyright />
        <% if (pkg.keywords) { %><tags><%= pkg.keywords.join(" ") %></tags><% } %>
        <% if(dependencies) { %>
            <dependencies>
                <% dependencies.forEach(function(dependency){ %>
                <dependency id="<%= dependency.id %>" version="<%= dependency.version %>" />
                <% }) %>
            </dependencies>
        <% } %>
    </metadata>
    <files>
        <% files.forEach(function(file) { %>
            <file src="<%= file.src %>" target="<%= file.target %>" />
        <% }) %>
    </files>
</package>